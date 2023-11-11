export type Root = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_photo: string;
  companies: Array<{
    company_id: string;
    company_name: string;
    company_logo: string;
    company_products: Array<{
      product_id: string;
      product_name: string;
      product_logo: string;
      projects: Array<{
        project_id: any;
        project_name: string;
        working_users: Array<{
          user_id: string;
          user_name: string;
          user_email: string;
          user_photo: string;
        }>;
        features?: Array<{
          feature_id: string;
          feature_name: string;
          deliveries: Array<{
            delivery_id: string;
            delivery_name: string;
            step?: string;
            event?: {
              start: any;
              end: any;
            };
            status?: Array<{
              status_name: string;
              value: number;
            }>;
          }>;
        }>;
      }>;
    }>;
  }>;
};

export const MOCK_USER: Root = {
  user_id: "usr1323p",
  user_name: "Patrick Moreira",
  user_email: "foo@bar.com",
  user_photo: "https://cdn-icons-png.flaticon.com/512/147/147142.png",
  companies: [
    {
      company_id: "company1dokawp",
      company_name: "Empresa 1",
      company_logo: "/logo_cartao-top_GUc4sy.png",
      company_products: [
        {
          product_id: "kepo12k_",
          product_name: "Produto 1",
          product_logo: "/logo_cartao-top_GUc4sy.png",
          projects: [
            {
              project_id: "NkO_fHMWkl",
              project_name: "Projeto 1",
              features: [
                {
                  feature_id: "V1KFMSMbyx",
                  feature_name: "Funcionalidade 1",
                  deliveries: [
                    {
                      delivery_id: "E1EcGHzb1e",
                      delivery_name: "entrega 1",
                      step: "Produção",
                      event: {
                        start: new Date(2023, 9, 23),
                        end: new Date(2023, 9, 27),
                      },
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                    {
                      delivery_id: "VJajzBGW1l",
                      delivery_name: "entrega 2",
                      step: "Homologação",
                      event: {
                        start: new Date(2023, 9, 23),
                        end: new Date(2023, 9, 27),
                      },
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                  ],
                },
                {
                  feature_id: "V1KFMyx3354",
                  feature_name: "Funcionalidade 10",
                  deliveries: [
                    {
                      delivery_id: "E1223b1e",
                      delivery_name: "entrega 12",
                      step: "Ideação",
                      event: {
                        start: new Date(2023, 9, 23),
                        end: new Date(2023, 9, 27),
                      },
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                    {
                      delivery_id: "VJ557zBGW1l",
                      delivery_name: "entrega 25",
                      step: "Ideação",
                      event: {
                        start: new Date(2023, 8, 10),
                        end: new Date(2023, 8, 18),
                      },
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                  ],
                },
              ],

              working_users: [
                {
                  user_id: "usr1323p",
                  user_name: "Patrick Moreira2",
                  user_email: "foo@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
                {
                  user_id: "usuoiepk",
                  user_name: "Raile Moreira",
                  user_email: "fo12o@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
              ],
            },
          ],
        },
        {
          product_id: "238939kj",
          product_name: "Produto 2",
          product_logo:
            "https://cdn-icons-png.flaticon.com/512/8676/8676496.png",
          projects: [
            {
              project_id: 879789,
              project_name: "Projeto 3",
              features: [
                {
                  feature_id: "333213",
                  feature_name: "Funcionalidade 4",
                  deliveries: [
                    {
                      delivery_id: "E1EcGHzb1e",
                      delivery_name: "entrega 1",
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                    {
                      delivery_id: "VJajzBGW1l",
                      delivery_name: "entrega 2",
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                  ],
                },
                {
                  feature_id: "42136yh",
                  feature_name: "Funcionalidade 8",
                  deliveries: [
                    {
                      delivery_id: "E1223b1e",
                      delivery_name: "entrega 12",
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                    {
                      delivery_id: "ewqefcxx",
                      delivery_name: "entrega 1235",
                      status: [
                        { status_name: "Sucesso", value: 0 },
                        { status_name: "Falhas", value: 0 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                  ],
                },
              ],
              working_users: [
                {
                  user_id: "usr13233p",
                  user_name: "Patrick Moreira",
                  user_email: "foo@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
                {
                  user_id: "usuoie323pk",
                  user_name: "Raile Moreira",
                  user_email: "fo12o@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      company_id: "company2dokawp",
      company_name: "Empresa 2",
      company_logo: "/unnamed.png",
      company_products: [
        {
          product_id: "238939kj",
          product_name: "Produto 4",
          product_logo:
            "https://cdn-icons-png.flaticon.com/512/8676/8676496.png",
          projects: [
            {
              project_id: 213,
              project_name: "Projeto 42",
              working_users: [
                {
                  user_id: "usr1323p",
                  user_name: "Patrick Moreira",
                  user_email: "foo@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
                {
                  user_id: "usuoiepk",
                  user_name: "Raile Moreira",
                  user_email: "fo12o@bar.com",
                  user_photo:
                    "https://cdn-icons-png.flaticon.com/512/147/147142.png",
                },
              ],
              features: [
                {
                  feature_id: "42136y414h",
                  feature_name: "Funcionalidade 123",
                  deliveries: [
                    {
                      delivery_id: "E1223b1e",
                      delivery_name: "entrega 12",
                      status: [
                        { status_name: "Sucesso", value: 3 },
                        { status_name: "Falhas", value: 4 },
                        { status_name: "Bloqueados", value: 0 },
                        { status_name: "Cancelados", value: 0 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

//FUNCTION extract

export function extractFeatureStatus(user: {
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_photo?: string;
  companies: any;
}) {
  const productStatus: any = {};

  user.companies.forEach(
    (company: {
      company_products: { product_name: string | number; projects: any[] }[];
    }) => {
      company.company_products.forEach(
        (product: { product_name: string | number; projects: any[] }) => {
          productStatus[product?.product_name] = [];

          product.projects.forEach((project: any) => {
            project.features?.forEach(
              (feature: { deliveries: any[]; feature_name: any }) => {
                const featureStatus = feature.deliveries.map(
                  (delivery: { delivery_name: any; status: any }) => ({
                    feature_name: feature.feature_name,
                    delivery_name: delivery.delivery_name,
                    status: delivery.status,
                  })
                );

                productStatus[product.product_name] = [
                  ...productStatus[product.product_name],
                  ...featureStatus,
                ];
              }
            );
          });
        }
      );
    }
  );

  return productStatus;
}
